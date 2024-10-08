export default function stringToJson<T>(base64String: string) {
  const json = Buffer.from(base64String, 'base64').toString();
  return JSON.parse(json) as T;
}
