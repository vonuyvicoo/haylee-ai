import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AdSetBillingEvent, CreateAdSetDto } from "../dto/create-adset.dto";
import { UpdateAdSetDto } from "../dto/update-adset.dto";
import { GOAL_TO_BILLING } from "@common/constants";

@ValidatorConstraint({ name: 'BillingEventGoalValidatorConstraint'}) 
export class BillingEventGoalValidatorConstraint implements ValidatorConstraintInterface {
    validate(billingEvent: AdSetBillingEvent, validationArguments: ValidationArguments): boolean {
        const goal = (validationArguments.object as CreateAdSetDto | UpdateAdSetDto).optimization_goal;
        if(!goal) return true;
        return GOAL_TO_BILLING[goal]?.includes(billingEvent) ?? true;
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        const goal = (validationArguments.object as CreateAdSetDto | UpdateAdSetDto).optimization_goal;
        const valid = GOAL_TO_BILLING[goal!]?.join(', ') ?? 'unknown';
        return `billing_event must be one of [${valid}] for optimization_goal ${goal}`;
    }
}
