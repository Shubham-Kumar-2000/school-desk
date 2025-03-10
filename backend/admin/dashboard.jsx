import React from "react";
import {
  Box,
  Button,
  H2,
  H5,
  Illustration,
  Text,
} from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

const pageHeaderHeight = 284;
const pageHeaderPaddingY = 74;
const pageHeaderPaddingX = 250;

const DashboardHeader = () => {
  return (
    <Box position="relative" overflow="hidden" data-css="default-dashboard">
      <Box
        position="absolute"
        top={50}
        left={-10}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Rocket" />
      </Box>
      <Box
        position="absolute"
        top={-70}
        right={-15}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Moon" />
      </Box>
      <Box
        bg="grey100"
        height={pageHeaderHeight}
        py={pageHeaderPaddingY}
        px={["default", "lg", pageHeaderPaddingX]}
      >
        <Text textAlign="center" color="white">
          <H2>Welcome On School-Desk Admin Panel</H2>
        </Text>
      </Box>
    </Box>
  );
};

const Card = styled(Box)`
  display: ${({ flex }) => (flex ? "flex" : "block")};
  color: ${({ theme }) => theme.colors.grey100};
  height: 100%;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.space.md};
  transition: all 0.1s ease-in;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary100};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

Card.defaultProps = {
  variant: "container",
  boxShadow: "card",
};

const Dashboard = () => {
  return (
    <Box>
      <DashboardHeader />
      <Box
        mt={["xl", "xl", "-100px"]}
        mb="xl"
        mx={[0, 0, 0, "auto"]}
        px={["default", "lg", "xxl", "0"]}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        width={[1, 1, 1, 1024]}
      >
        <Card width={1} m="lg">
          <Text textAlign="center">
            <img src="https://cs-school-desk.s3.amazonaws.com/1/1.png" />
          </Text>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
