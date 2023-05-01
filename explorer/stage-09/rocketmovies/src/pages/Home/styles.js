import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
`;

export const Content = styled.div`
  grid-area: content;
  background: yellow;
`;