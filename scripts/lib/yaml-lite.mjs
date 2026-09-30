/**
 * Indent-based YAML subset: maps, lists, nested list-of-maps, quoted scalars,
 * booleans, integers. Enough for catalog/*.yaml. Not a full YAML 1.2 parser.
 */

export function parseYaml(text) {
  const logical = []
  for (const [i, raw] of text.split(/\n/).entries()) {
    const stripped = raw.replace(/\t/g, "  ")
    if (!stripped.trim() || /^\s*#/.test(stripped)) continue
    const indent = stripped.match(/^ */)[0].length
    logical.push({ indent, text: stripped.trim(), line: i + 1 })
  }
  const { value, next } = parseBlock(logical, 0, 0)
  if (next < logical.length) {
    throw new Error(`yaml-lite: unexpected content at line ${logical[next].line}`)
  }
  return value
}

function parseBlock(lines, index, indent) {
  if (index >= lines.length || lines[index].indent < indent) {
    return { value: null, next: index }
  }
  if (lines[index].text.startsWith("- ")) {
    return parseList(lines, index, indent)
  }
  return parseMap(lines, index, indent)
}

function parseMap(lines, index, indent) {
  const map = {}
  let i = index
  while (i < lines.length && lines[i].indent === indent && !lines[i].text.startsWith("- ")) {
    const { key, rest } = splitKey(lines[i].text, lines[i].line)
    i += 1
    if (rest !== null) {
      map[key] = parseScalar(rest)
      continue
    }
    if (i >= lines.length || lines[i].indent <= indent) {
      map[key] = null
      continue
    }
    const nested = parseBlock(lines, i, lines[i].indent)
    map[key] = nested.value
    i = nested.next
  }
  return { value: map, next: i }
}

function parseList(lines, index, indent) {
  const list = []
  let i = index
  while (i < lines.length && lines[i].indent === indent && lines[i].text.startsWith("- ")) {
    const itemText = lines[i].text.slice(2)
    const line = lines[i].line
    i += 1
    if (!itemText) {
      if (i < lines.length && lines[i].indent > indent) {
        const nested = parseBlock(lines, i, lines[i].indent)
        list.push(nested.value)
        i = nested.next
      } else {
        list.push(null)
      }
      continue
    }
    if (looksLikeKey(itemText)) {
      const { key, rest } = splitKey(itemText, line)
      const item = {}
      item[key] = rest === null ? null : parseScalar(rest)
      if (i < lines.length && lines[i].indent > indent) {
        const nested = parseMap(lines, i, lines[i].indent)
        Object.assign(item, nested.value)
        i = nested.next
      }
      list.push(item)
      continue
    }
    list.push(parseScalar(itemText))
  }
  return { value: list, next: i }
}

function looksLikeKey(text) {
  return /^(?:[A-Za-z_][\w-]*|"[^"]+"|'[^']+'):(?:\s|$)/.test(text)
}

function splitKey(text, line) {
  const m = /^(?:([A-Za-z_][\w-]*)|"([^"]+)"|'([^']+)'):\s*(.*)$/.exec(text)
  if (!m) throw new Error(`yaml-lite: expected key at line ${line}: ${text}`)
  const key = m[1] ?? m[2] ?? m[3]
  const rest = m[4] === "" ? null : m[4]
  return { key, rest }
}

function parseScalar(raw) {
  if (raw === "~" || raw === "null") return null
  if (raw === "true") return true
  if (raw === "false") return false
  if (/^-?\d+$/.test(raw)) return Number(raw)
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1)
  }
  return raw
}

export function dumpYaml(value, indent = 0) {
  return dump(value, indent).replace(/\n$/, "")
}

function dump(value, indent) {
  const pad = "  ".repeat(indent)
  if (value === null || value === undefined) return `${pad}null\n`
  if (typeof value === "boolean" || typeof value === "number") return `${pad}${value}\n`
  if (typeof value === "string") return `${pad}${quote(value)}\n`
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}[]\n`
    return value
      .map((item) => {
        if (item !== null && typeof item === "object" && !Array.isArray(item)) {
          const keys = Object.keys(item)
          if (keys.length === 0) return `${pad}-\n`
          const [first, ...rest] = keys
          let out = `${pad}- ${first}: ${inlineOrBlank(item[first])}`
          if (!isNested(item[first])) out += "\n"
          else out = `${pad}- ${first}:\n${dump(item[first], indent + 2)}`
          for (const key of rest) {
            if (isNested(item[key])) out += `${pad}  ${key}:\n${dump(item[key], indent + 2)}`
            else out += `${pad}  ${key}: ${formatInline(item[key])}\n`
          }
          return out
        }
        if (isNested(item)) return `${pad}-\n${dump(item, indent + 1)}`
        return `${pad}- ${formatInline(item)}\n`
      })
      .join("")
  }
  const keys = Object.keys(value)
  if (keys.length === 0) return `${pad}{}\n`
  return keys
    .map((key) => {
      const child = value[key]
      if (isNested(child)) return `${pad}${key}:\n${dump(child, indent + 1)}`
      return `${pad}${key}: ${formatInline(child)}\n`
    })
    .join("")
}

function isNested(value) {
  return value !== null && typeof value === "object"
}

function inlineOrBlank(value) {
  return isNested(value) ? "" : formatInline(value)
}

function formatInline(value) {
  if (value === null || value === undefined) return "null"
  if (typeof value === "boolean" || typeof value === "number") return String(value)
  return quote(String(value))
}

function quote(value) {
  if (value === "") return '""'
  if (/[:#{}[\],&*?|<>=!%@`']/.test(value) || /^-/.test(value) || /\s/.test(value)) {
    return JSON.stringify(value)
  }
  return value
}
