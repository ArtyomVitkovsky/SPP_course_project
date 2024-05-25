import { useState } from "react";
import PageCard from "../components/PageCard";
import VerticalMenu from "../components/SideMenu/VerticalMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [headerText, setHeaderText] = useState("Home Page");

    const menuItems = [
        { name: "Users", text: "Users", iconName: "UsersIcon", iconClassName: "UsersIcon.js", url: "/home/users" },
        { name: "Documents", text: "Documents", iconName: "DocumentTextIcon", iconClassName: "DocumentTextIcon.js", url: "/home/documents" },
        { name: "Sended", text: "Sended", iconName: "PaperAirplaneIcon", iconClassName: "PaperAirplaneIcon.js", url: "" },
    ]

    const currentMenuItem = menuItems.find((item) => item.url === location.pathname)

    const [selectedMenuItem, setSelectedMenuItem] = useState(currentMenuItem?.name);


    const setSelecteMenuItemHandler = (name) => {
        setHeaderText(name)
        setSelectedMenuItem(name)

        const menuItem = menuItems.find(i => i.name == name);
        if (menuItem) {
            navigate(menuItem.url)
        }
    }

    return (
        <div className="py-10 h-full">
            <PageCard headerText={headerText}>

                <VerticalMenu menuItems={menuItems} presettedValue={selectedMenuItem} onItemSelectAction={setSelecteMenuItemHandler}></VerticalMenu>

                <Outlet />

            </PageCard>

            <Toaster />

        </div>
    )
}

export default HomePage;