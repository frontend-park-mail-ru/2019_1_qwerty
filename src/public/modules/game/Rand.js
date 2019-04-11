export default function Rand (from, to) {
    return Math.floor(from + Math.random() * (to + 1 - from));
}
