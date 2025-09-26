const url = `${import.meta.env.VITE_API_URL}`;

async function get(endpoint: string, token?: string) {
  try {
    const res = await fetch(url + endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ? token : ""}`,
      },
      method: "GET",
    });
    return handleRes(res);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error when fetching:", error.message);
      prompt(error.message);

      return { data: { message: "Failed to fetch" }, status: 500 }; //lazy
    }
  }
}

async function post(endpoint: string, body: any, token?: string) {
  try {
    const res = await fetch(url + endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token ? token : ""}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    return handleRes(res);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error when fetching:", error.message);
      prompt(error.message);

      return { data: { message: "Failed to fetch" }, status: 500 }; //lazy
    }
  }
}

async function handleRes(res: Response) {
  const data = await res.json();
  console[res.status >= 400 ? "error" : "log"](res.status, data.message);
  prompt(data.message, data.message); // TODO: remove later

  return { data, status: res.status };
}

export { get, post };