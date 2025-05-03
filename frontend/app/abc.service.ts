import Http, { attachToken } from "@/lib/Http";

export const getHello = async (_params: any, token: string | null) => {
  console.log("fetching API...");
  const url = "http://localhost:3000/api/";

  const params = attachToken(_params, token);

  // try {
    const res = await Http.get(url, params);
    console.log("Data = ", res);
    return res;
  // } catch (err: any) {
  //   console.log("loi roi ne: ", err);
  //   throw err;
  // }
};
