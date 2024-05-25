import PropTypes from "prop-types";
import * as Icons from "@heroicons/react/24/outline"

const Icon = ({ iconName = '', iconClassName = '', textColor = '' }) => {
    const { ...icons } = Icons;
    const Icon = icons[iconName];
    return (
        iconName && <Icon className={textColor + " " + iconClassName} />
    );
}

Icon.propTypes = {
    iconName: PropTypes.string,
    iconClassName: PropTypes.string
};

export default Icon;