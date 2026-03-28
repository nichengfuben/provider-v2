// 生成一个随机的唯一 id
export function generateUniqueId(prex = "") {
  const id = `${Math.floor(Math.random() * 0xffffffff)}`;
  return prex ? `${prex}${id}` : id;
}
