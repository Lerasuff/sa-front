import { StepAction} from "@/contracts/StepAction.ts";

export class StepModel {
  protected action: StepAction = StepAction.Nop;
  protected attacker: string;
  protected victim: string;
  protected attackerLine?: number;
  protected attackerPos?: number;
  protected victimLine?: number;
  protected victimPos?: number;
  protected damageAmount?: number;

  constructor(
    action: StepAction,
    attacker: string,
    victim: string,
    attackerLine?: number,
    attackerPos?: number,
    victimLine?: number,
    victimPos?: number,
    damageAmount?: number,
  ) {
    this.action = action;
    this.attacker = attacker;
    this.attackerLine = attackerLine;
    this.attackerPos = attackerPos;
    this.victim = victim;
    this.victimLine = victimLine;
    this.victimPos = victimPos;
    this.damageAmount = damageAmount;
  }
}
