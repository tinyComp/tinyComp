import { OptionClass } from "./option-class.enum";

export class Option {
    name: string;
    order?: number;
    type: string;
    default: string;
    description: string;
    versionAdded?: string;
    versionDeleted?: string;
}
