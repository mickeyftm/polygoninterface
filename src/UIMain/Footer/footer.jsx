import { Flex, useMatchBreakpoints } from "@pancakeswap-libs/uikit";
import styled from "styled-components";
import { githubIcon, telegramIcon, twitterIcon } from "./icons";

const StyledFooter = styled.footer`
  display: flex;
  width: 100%;
  height: 60px;
  min-height: 60px;
  flex-direction: row;
  background-color: var(--c-background);
  bottom: 0;
  left: 0;
  margin-top: auto;
  align-items: center;
  z-index: 6;
`;

const FooterContent = styled(Flex)`
  position: relative;
  width: var(--content-width);
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  padding: 0;
  flex-direction: row;
  align-items: center;
`;

const Label = () => {
  const { isSm, isXs } = useMatchBreakpoints();
  const isSmall = isSm || isXs;

  return (
    <StyledFooter style={{ position: isSmall ? "fixed" : "relative" }}>
      <FooterContent justifyContent={isSmall ? "center" : "auto"}>
        {!isSmall && (
          <div className="copyright">
            © 2021 Retro DeFi. All rights reserved.
          </div>
        )}
        <div
          className="social"
          style={{ marginLeft: isSmall ? "initial" : "auto" }}
        >
          <a
            rel="noreferrer"
            href="https://github.com/RetroDefi"
            target="_blank"
            aria-label="github"
          >
            <img alt="github" src={githubIcon} />
          </a>
          <a
            rel="noreferrer"
            href="https://twitter.com/retrodefi"
            target="_blank"
            aria-label="twitter"
          >
            <img alt="twitter" src={twitterIcon} />
          </a>
          <a
            rel="noreferrer"
            href="https://t.me/retrodefibsc"
            target="_blank"
            aria-label="telegram"
          >
            <img alt="telegram" src={telegramIcon} />
          </a>
        </div>
      </FooterContent>
    </StyledFooter>
  );
};

export default Label;
