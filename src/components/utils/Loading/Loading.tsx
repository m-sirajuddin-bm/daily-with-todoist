import "./loading.css";

export default function Loading(props?: { color: "primary" | "accent" | "white" }) {
  const colors = {
    primary: "!border-t-primary-900",
    accent: "!border-t-accent-900",
    white: "!border-t-white",
  };

  return (
    <>
      <div className="lds-ring">
        <div className={`${props && (props.color ? colors[props.color] : "")}`}></div>
        <div className={`${props && (props.color ? colors[props.color] : "")}`}></div>
        <div className={`${props && (props.color ? colors[props.color] : "")}`}></div>
        <div className={`${props && (props.color ? colors[props.color] : "")}`}></div>
      </div>
    </>
  );
}
