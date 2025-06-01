//Todo: load a script by src
/**
 * # Todo: load async a script by src
 * - Example:
 * ```typescript
 * useEffect(() => {
 *    // Load script for this page
 *    const scriptSrc = "https://code.jquery.com/jquery-3.7.1.min.js"
 *    let scriptRemove: Function
 *    loadScript(scriptSrc)
 *      .then((remove) => {
 *        scriptRemove = remove
 *        //Check jquery loaded
 *        console.log("jQuery loaded, jQuery = ", (window as any).$)
 *      })
 *    // Unmount
 *    return () => {
 *    };
 *  }, []);
 * ```
 * @param src 
 * @returns 
 */
const loadScript = (src: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        //Create script tag
        const scriptTag = document.createElement('script');
        // Add src
        scriptTag.src = src;
        scriptTag.async = true;

        // Events
        scriptTag.onload = () => {
            resolve();
        };
        scriptTag.onerror = (error) => {
            //Remove
            document.body.removeChild(scriptTag);
            //Reject
            reject(error);
        };
        document.body.appendChild(scriptTag);
    });
};
//Export
export { loadScript }