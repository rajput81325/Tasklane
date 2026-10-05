export default function Avatar({ person, size = 28 }) {
  if (!person) return null;
  const initials = person.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const style = { width: size, height: size, fontSize: size * 0.4 };
  return person.avatar_url ? (
    <img className="avatar" src={person.avatar_url} alt="" style={style} referrerPolicy="no-referrer" />
  ) : (
    <span className="avatar avatar-fallback" style={style} aria-hidden="true">
      {initials}
    </span>
  );
}
