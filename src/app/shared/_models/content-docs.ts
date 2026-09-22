import { Attribute } from "./attribute";
import { GroupOption } from "./group-option";

export class ContentDocs {
    title: string;
    id: string;
    icon: string;
    desc: string | string[];
    options?: GroupOption[];
    attributes?: Attribute[];
}
