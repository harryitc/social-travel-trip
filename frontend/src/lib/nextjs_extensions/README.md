# Nextjs Extensions
1. Layouts
- All layouts in folder ```src/layouts```
- 1 layout in 1 file
- Filename is the key
- All layouts will ```automaticcally``` add to file ```src/layouts/index.tsx``` (Needn't any actions)
- Add layout to page:
```typescript
//File: page.tsx
const async function page() {...}
//Export 
export default addLayout(page, 'layoutKey')//layoutKey is layout filename
```

2. Load data from server in a page
- Target: Load data from server to build a page, example: ```NewsDetailPage```
--> Load news data from server by newsId and pass news data to ```Layout, Page, and NewsDetailComponent```
- Code:
    1. In page folder, create file ```load_data.tsx```
    2. Use ```make(page, config)``` in ```src/lib/nextjs_extensions/page/index.tsx``` to set ```loadData``` function and ```layout```
    3. ```loadData``` is READ ONLY! DO NOT MANUAL CHANGE OR SET PROPERTIES OF ```loadData``` function!
    - ```DO NOT DO this: loadData.data = 123```

```typescript
//File: load_data.tsx
export const loadData: any = async ({ newsId }: any) => {
    // throw "Bad request"
    return {
        news: {
            newsId,
            title: "News title " + newsId,
            description: "News description " + newsId,
            content: "News content " + newsId,
        }
    };
}
//File: page.tsx
import {loadData} from "./load_data"
import { make } from '@/lib/nextjs_extensions/page';
//Generate metadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
    console.log("Workflow: page", loadData.data, loadData.error)
    return metadata
}
// Page
async function page({ params }: Props) {
    console.log("Workflow: page", loadData.data, loadData.error)
    const news = loadData.data?.news
    return (
        <>
            {news && <NewsDetailComponent news={news} />}
            {!news && <ErrorComponent error={loadData.error}/>}
        </>
    )
}

// Make page with configs then export
export default make(page,
  {
    layout: "news-detail",
    loadData,
  })
```
3. Load script
- Load a script by src, use function ```async loadScript(scriptSrc)``` in ```lib/nextjs_extensions/typescript/loader```

- Code:
```typescript
  useEffect(() => {
     // Load script for this page
     const scriptSrc = "https://code.jquery.com/jquery-3.7.1.min.js"
    let scriptRemove: Function
     loadScript(scriptSrc)
       .then((remove) => {
         scriptRemove = remove
        //Check jquery loaded
         console.log("jQuery loaded, jQuery = ", (window as any).$)
      })
     // Unmount
    return () => {
     };
  }, []);
  ```
  4. Add ```css``` and ```js``` files in <head></head>
  - Add in file ```src/app/layout.tsx```
```html
    <head>
        <link rel="stylesheet" href="/styles/system.css" />
        <script src="/scripts/system.js" defer></script>
    </head>
```