import { Link } from "react-router-dom";

export const CredentialsTable = ({ credentials }) => {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-ss-lg">
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr scope="col" className="">
                        <th scope="col" className="px-6 py-3">
                            Platform
                        </th>
                        <th scope="col" className="px-6 py-3">
                            password
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Operations
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {credentials.map((credential) => (
                        <tr key={credential._id} className="bg-white border-b">
                            <td
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {credential.platform}
                            </td>
                            <td scope="row" className="px-6 py-4">
                                {credential.password}
                            </td>
                            <td scope="row" className="px-6 py-4">
                                {/* <Link
                                    to={``}
                                    className="underline underline-offset-4  hover:text-blue-600 bg-white text-gray-700">
                                    Edit
                                </Link> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
