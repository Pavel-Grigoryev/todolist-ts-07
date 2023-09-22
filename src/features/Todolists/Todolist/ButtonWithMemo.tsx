import React, {FC, memo} from "react";
import Button from "@mui/material/Button";

type PropsType = {
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    onclick: () => void
    title: string
    marginRight?: string
}
export const ButtonWithMemo: FC<PropsType> = memo(({variant, color, onclick, title, marginRight}) => {
    return <Button
        onClick={onclick}
        variant={variant}
        color={color}
        size={"small"}
        style={{
            marginRight: `${marginRight}`
        }}
        disableElevation
    >
        {title}
    </Button>

})
