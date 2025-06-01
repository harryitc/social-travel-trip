
import Auth from "./auth";
import Default from "./default";
import DocTruyen from "./doc-truyen";
import Policy from "./policy";


//Layout Type
type LayoutType = "auth" | "default" | "doc-truyen" | "policy"
//Default layout
const DefaultLayout: LayoutType = "default"
// All layouts
const Layouts: { [key: string]: any } = {
    "auth": Auth,
    "default": Default,
    "doc-truyen": DocTruyen,
    "policy": Policy,

}
//Export
export { Layouts, DefaultLayout }
export type { LayoutType }
