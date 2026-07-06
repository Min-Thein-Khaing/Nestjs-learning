import { AccessTokenGuard } from './../access-token/access-token.guard';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from 'src/auth/enum/auth-type-enum';
import { AUTH_TYPE_KEY } from 'src/auth/decorators/auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardsMapped: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;
  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector,
  ) {
    this.authTypeGuardsMapped = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ၁။ Reflector ကိုသုံးပြီး Controller/Route မှာ ကပ်ခဲ့တဲ့ @Auth(...) ရဲ့ တန်ဖိုးကို ယူမယ်
    // ဥပမာ- @Auth(AuthType.Bearer) လို့ ရေးခဲ့ရင် authTypes က [AuthType.Bearer] ဖြစ်မယ်
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) || [AuthenticationGuard.defaultAuthType];
    // ၂။ ဝင်လာတဲ့ AuthType အလိုက် သက်ဆိုင်ရာ Guard ကို မြေပုံ (Map) ထဲကနေ လှမ်းထုတ်မယ်
    const guards = authTypes
      .map((type) => this.authTypeGuardsMapped[type])
      .flat();

    let lastError: any = new UnauthorizedException();
    for (const instance of guards) {
      try {
        // Promise.resolve သုံးပြီး အလုပ်လုပ်ခိုင်းတယ်
        const canActivateResult = await Promise.resolve(
          instance.canActivate(context),
        );

        if (canActivateResult) {
          return true; // တစ်ခုခု အောင်မြင်တာနဲ့ တန်းပေးဝင်မယ်
        }
      } catch (err: unknown) {
        // Error တက်ခဲ့ရင် နောက်ဆုံးတက်တဲ့ကောင်ကို မှတ်ထားမယ်
        if (err instanceof Error) {
          lastError = err;
        } else {
          lastError = new UnauthorizedException(String(err));
        }
      }
    }

    throw lastError;
  }
}
