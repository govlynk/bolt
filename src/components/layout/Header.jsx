import { Typography, Box, useTheme } from "@mui/material";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Box mb="20px">
      <Box display="flex" alignItems="center">
        <Typography 
          variant="h4" 
          color={theme.palette.text.primary}
          fontWeight="bold" 
          sx={{ m: "0 5px 0 0" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h4"
            color="primary.light"
            sx={{
              color: theme.palette.primary.light,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Header;