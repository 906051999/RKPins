const API_URL = process.env.LLM_API_URL;
const API_KEY = process.env.LLM_API_KEY;

export async function sendMessageToLLM(message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        message: message,
        // 根据您的API要求添加其他必要的参数
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response; // 假设API返回的数据中有一个response字段

  } catch (error) {
    console.error("Error sending message to LLM:", error);
    throw error;
  }
}
