export const Button = ({ customStyles, children, ...props }) => {
    let styles = "cursor-pointer";

    if (customStyles === "primary") {
        styles +=
            " px-6 py-2 bg-black text-white rounded-lg font-bold  transition duration-400 hover:bg-gray-800 disabled:opacity-75 disabled:cursor-wait ";
    } else if (customStyles === "secondary") {
        styles +=
            " px-2 underline underline-offset-4 hover:text-blue-800 text-gray-700 ";
    } else if (customStyles === "tertiary") {
        styles +=
            " text-gray-600 hover:underline hover:underline-offset-4 hover:text-blue-600";
    } else {
    }
    return (
        <button className={styles} {...props}>
            {children}
        </button>
    );
};
