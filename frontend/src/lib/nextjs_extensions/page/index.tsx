import { DefaultLayout, LayoutType } from "@/layouts"
import { addLayout } from "../layouts"
import { isAsync } from "../typescript/lang"

// Page config
interface PageConfig {
    layout?: LayoutType
    loadData?: (params: any) => Promise<any>
}
// Todo: Interface cho async loadData(params: any) => Promise<Object> function
/**
 * # LoadData interface
 * - loadData: ILoadData
 * - Get data: ```loadData.data```
 * - Get error: ```loadData.error```
 */
interface ILoadData {
    /**
     * ## Function loadData(params): Promise<any>
     */
    (params: any): Promise<any>
    /**
     * # Mark data is fetched
     */
    isLoaded?: boolean
    /**
     * ## Data return after execute loadData function
     */
    data?: any
    /**
     * ## Error happens after execute loadData function
     */
    error?: any
}
//Todo: Add some system logic to page function
/**
 * # make(page, config)
 * Add some system logic to page function with config
 * ## NOTE: The page function must be ASYNC!!!
 * ## ```config```:
 *  - ```layout```: a key is the filename in folder ```src/layouts```
 *      + If not set ```layout```, ```default``` layout will be used
 *  - ```loadData```: ```async function``` to fetch data from network
 *      + Data: ```loadData.data```
 *      + Error: ```loadData.error```
 * 
 * ```
 * const async function page({params}) {
 *  console.log("Data loaded from function loadData = ", loadData.data)
 * }
 * export async function generateMetadata({params}) {
 *  console.log("Data loaded from function loadData = ", loadData.data)
 * }
 * 
 * // Make page with configs
 * export default make(page,
 *   {
 *     layout: "layout-name",
 *     loadData,
 *   })
 * ```
 * @param page
 * @param config 
 * @returns
 */
const make = (page: any, config?: PageConfig) => {
    //Layout
    let MadePage: any = addLayout(page, config?.layout ?? DefaultLayout)
    const loadData: any = config?.loadData;
    //Load data if async
    if (loadData) {
        if (isAsync(page)) {
            const originalMadePage = MadePage;
            MadePage = async (props: any) => {
                // loadData is executed
                if (loadData.isLoaded) {
                    return originalMadePage(props)
                }
                // Load data
                try {
                    loadData.data = await loadData!(await props?.params); // Pass params or the entire props to loadData
                } catch (error) {
                    loadData.error = error
                }
                //Marks as loaded
                loadData.isLoaded = true;
                // Freeze loadData
                Object.freeze(loadData);

                // Add the loaded data to the props and call original page
                return originalMadePage(props);
            }
        } else {
            throw "make(page): loadData must be set with an async page function";
        }
    }
    //Return
    return MadePage
}

///Export
export { make }
export type { ILoadData }