export const gatherResponse = async (response) =>  {
  return await response.json();
}

export const writeKv = async ({ accountIdentifier, kvNamespace, apiToken, key, value }) => {
  const kvWriteApiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountIdentifier}/storage/kv/namespaces/${kvNamespace}/values/${key}`;

  const body = typeof(value) !== "string"
    ? JSON.stringify(value)
    : value;

  const options = {
    method: "PUT",
    body,
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
  };

  const cfApiResponse= await fetch(kvWriteApiUrl, options);
  // const responseData = await gatherResponse(cfApiResponse);
  // console.log(JSON.stringify(responseData, null, 4));
}
