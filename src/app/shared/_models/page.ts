import { ContentChangeLog } from "./content-change-log";
import { ContentDocs } from "./content-docs";
import { ContentExamples } from "./content-examples";
import { ContentFeatures } from "./content-features";
import { PageType } from "./page-type.enum";

export class Page {
    title: string;
    titleHtml: string;
    metaHtml: {
        name: string;
        content: string;
    };
    type: PageType;
    content: ContentFeatures | ContentExamples | ContentDocs | ContentChangeLog;
}
