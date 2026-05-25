export default function groupCommentsFlat(comments) {
  const commentMap = new Map();

  // Map id -> comment
  comments.forEach((c) => commentMap.set(c.id, { ...c }));

  // Map id -> rootId
  const findRoot = (comment) => {
    let current = comment;
    while (current.parentId !== null) {
      current = commentMap.get(current.parentId);
    }
    return current.id;
  };

  // Gom theo rootId
  const groupMap = new Map();
  comments.forEach((comment) => {
    const rootId = comment.parentId === null ? comment.id : findRoot(comment);
    if (!groupMap.has(rootId)) {
      groupMap.set(rootId, []);
    }
    groupMap.get(rootId).push(comment);
  });

  // Trả về dạng array các nhóm
  return Array.from(groupMap.values());
}
