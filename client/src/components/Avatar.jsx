import Tooltip from "./Tooltip";

function Avatar({ firstName, lastName }) {

    const generateColor = (fullName, s, l) => {
        var hash = 0;
        for (var i = 0; i < fullName.length; i++) {
            hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
        }

        var h = hash % 360;
        return hslToHex(h, s, l);
    };

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    return (
        <div className="group">
            <div className="flex items-center justify-center font-semibold text-white text-xl rounded-full w-10 h-10 cursor-default"
                style={{
                    background: generateColor(firstName + lastName, 50, 50)
                }}>
                <span className="align-middle">{firstName[0]}{lastName[0]}</span>
            </div>
            <Tooltip text={firstName + " " + lastName}></Tooltip>
        </div>
    )
}

export default Avatar;