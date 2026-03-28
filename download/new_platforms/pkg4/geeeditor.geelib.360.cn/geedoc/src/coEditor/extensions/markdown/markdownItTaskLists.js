// 由 https://github.com/revin/markdown-it-task-lists/blob/master/dist/markdown-it-task-lists.js 修改
// 修改 ul li 和 checked 的标识，与tiptap 中task-list 和task-item 的 parseHTML 中对应

export default function markdownItTaskLists(md, options) {
  md.core.ruler.after("inline", "tiptap-task-lists", function (state) {
    var tokens = state.tokens;

    for (var i = 2; i < tokens.length; i++) {
      if (isTodoItem(tokens, i)) {
        const checked = getCheck(tokens[i], state.Token);

        tokens[i].children[0].content = tokens[i].children[0].content.slice(3);
        tokens[i].content = tokens[i].content.slice(3);

        attrSet(tokens[i - 2], "data-type", "taskItem");
        attrSet(tokens[i - 2], "data-checked", checked);
        attrSet(tokens[parentToken(tokens, i - 2)], "data-type", "taskList");
      }
    }
  });
}

function attrSet(token, name, value) {
  var index = token.attrIndex(name);
  var attr = [name, value];

  if (index < 0) {
    token.attrPush(attr);
  } else {
    token.attrs[index] = attr;
  }
}

function parentToken(tokens, index) {
  var targetLevel = tokens[index].level - 1;
  for (var i = index - 1; i >= 0; i--) {
    if (tokens[i].level === targetLevel) {
      return i;
    }
  }
  return -1;
}

function isTodoItem(tokens, index) {
  return isInline(tokens[index])
    && isParagraph(tokens[index - 1])
    && isListItem(tokens[index - 2])
    && startsWithTodoMarkdown(tokens[index]);
}

function isInline(token) {
  return token.type === "inline";
}

function isParagraph(token) {
  return token.type === "paragraph_open";
}

function isListItem(token) {
  return token.type === "list_item_open";
}

function startsWithTodoMarkdown(token) {
  // leading whitespace in a list item is already trimmed off by markdown-it
  return token.content.indexOf("[ ] ") === 0 || token.content.indexOf("[x] ") === 0 || token.content.indexOf("[X] ") === 0;
}

function getCheck(token) {
  if (token.content.indexOf("[ ] ") === 0) {
    return false;
  }

  if (token.content.indexOf("[x] ") === 0 || token.content.indexOf("[X] ") === 0) {
    return true;
  }

  return false;
}
