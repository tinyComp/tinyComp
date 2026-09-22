import { Option } from "./option";
import { OptionClass } from "./option-class.enum";

export class GroupOption {
    type: OptionClass;
    title: string;
    options: Option[];
}
