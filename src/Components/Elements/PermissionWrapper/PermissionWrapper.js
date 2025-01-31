import React from "react";
import { useAuth } from "../../../AuthContext";


const PermissionWrapper = ({ children, topModuleCode, subModuleCode, pageCode, rightCode }) => {
    const { permissions } = useAuth();

    // Recursive permission check
    const hasPermission = () => {
        // Find the top module
        const topModule = permissions.find((module) => module.topModuleCode === topModuleCode);
        if (!topModule) return false;

        // Find the submodule within the top module
        const subModule = topModule.subModules?.find((sub) => sub.code === subModuleCode);
        if (!subModule) return false;

        // Find the page within the submodule
        const page = subModule.modulePages?.find((pg) => pg.code === pageCode);
        if (!page) return false;

        // Check if the required right exists in the page's rights
        return page.modulePageRights?.some((right) => right.rightCode === rightCode);
    };

    // Render children if permission is granted
    return hasPermission() ? <>{children}</> : null;
};

export default PermissionWrapper;
