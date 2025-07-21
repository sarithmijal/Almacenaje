import { CircularProgress } from '@mui/material';

export default function Loader({ message = "" }) {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center">
                <CircularProgress style={{ color: 'red' }} />
                <p className="mt-2 text-sm text-red-600 font-medium">{message}</p>
            </div>
        </div>
    );
}
