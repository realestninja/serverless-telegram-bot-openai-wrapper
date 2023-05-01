export const gatherResponse = async (response) =>  {
  const { headers } = response;
  const contentType = headers.get('content-type');

  if (contentType.includes('application/json')) {
    const body = await response.json();
    return JSON.stringify(body);
  } else if (contentType.includes('application/text')) {
    const body = await response.text();
    return body;
  } else if (contentType.includes('text/html')) {
    const body = await response.text();
    return body;
  } else {
    const body = await response.text();
    return body;
  }
};

const buildKvApiUrl = ({ accountIdentifier, kvNamespace, key }) => `https://api.cloudflare.com/client/v4/accounts/${accountIdentifier}/storage/kv/namespaces/${kvNamespace}/values/${key}`;

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
