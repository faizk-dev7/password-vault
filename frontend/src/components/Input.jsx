export default function Input({ label, id, error, ...props }) {
    let styles =
        "w-full h-10 px-2 rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]";
    if (error) {
        styles += " border border-red-500 border-solid";
    }
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-gray-600">
                {label}
            </label>
            <div>
                <input id={id} {...props} className={styles} />
            </div>
            <div className="">{error && <p>{error}</p>}</div>
        </div>
    );
}
