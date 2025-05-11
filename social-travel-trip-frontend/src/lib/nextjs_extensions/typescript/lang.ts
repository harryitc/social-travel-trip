// Todo: Check if a function is async
const isAsync = (f: any) => f.constructor.name === 'AsyncFunction';

//Export
export { isAsync }