import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorators";
import { UserRole } from "../entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate{

  //Reflector -> utility that will help to access metadata 
  constructor(private reflector: Reflector){}
  
  // canActivate -> method that will be called by nestjs to determine if request is allowed or not
  canActivate(context: ExecutionContext): boolean  {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY, [ 
        context.getHandler(), // method level metadata
        context.getClass() // class level metadata
      ]
    );

    if(!requiredRoles){
      return true; // if no roles are required, allow access
    }

    const {user} = context.switchToHttp().getRequest()
    if(!user){
      throw new ForbiddenException('User not authenticated')
    }

    const hasRequiredRole = requiredRoles.some(role => user.roleb === role);

    if(!hasRequiredRole){
      throw new ForbiddenException('User does not have the required role to access this resource');
    }
  
    return true;
  }
}