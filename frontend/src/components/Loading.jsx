export const Loading = ({ loadingMessage }) => {
    return (
        <div className="text-center text-2xl">
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div>{loadingMessage}</div>
        </div>
    );
};
