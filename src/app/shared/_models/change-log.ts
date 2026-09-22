import { ChangeLogItem } from "./change-log-item";

export class ChangeLog {
    title?: string;
    fix?: ChangeLogItem[];
    new?: ChangeLogItem[];
}
