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
  const kvApiUrl = buildKvApiUrl({ accountIdentifier, kvNamespace, key });

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

  const cfApiWriteResponse = await fetch(kvApiUrl, options);
  // const responseData = await gatherResponse(cfApiWriteResponse);
  // console.log(JSON.stringify(responseData, null, 4));
}

export const readKv = async ({ accountIdentifier, kvNamespace, apiToken, key }) => {
  const kvApiUrl = buildKvApiUrl({ accountIdentifier, kvNamespace, key });

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiToken}`
    },
  };

  const cfApiReadResponse = await fetch(kvApiUrl, options);
  return await gatherResponse(cfApiReadResponse);
}
