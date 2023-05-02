import React, { CSSProperties } from 'react';
import styled from 'styled-components';

const ArrowWrapper = styled.svg.attrs({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 100 100',
})`
  width: 0.8em;
  aspect-ratio: 1;
  fill: black;
  stroke: black;
`;

export const RightArrow = ({
  className = '',
  style = {},
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <ArrowWrapper className={className} style={style}>
    <path d="M 20,45 l 0,10 l30,0 l0,45 l50,-50 l-50,-50 l0,45z" />
  </ArrowWrapper>
);

export const LeftArrow = styled(RightArrow)`
  transform: rotate(180deg) translateY(0.01em);
`;

export const UpArrow = styled(RightArrow)`
  transform: rotate(90deg);
`;

export const DownArrow = styled(RightArrow)`
  transform: rotate(-90deg);
`;

const CollapseIconWrapper = styled.svg.attrs({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 36.305 20',
})`
  width: 1.6em;
`;

export const CollapseIcon = () => (
  <CollapseIconWrapper>
    <g
      id="Group_3068"
      data-name="Group 3068"
      transform="translate(-2707.848 -327)"
    >
      <g id="Group_3069" data-name="Group 3069" transform="translate(-19)">
        <path
          id="Polygon_56"
          data-name="Polygon 56"
          d="M10,0,20,9H0Z"
          transform="translate(2742 327) rotate(90)"
        />
        <path
          id="Path_349"
          data-name="Path 349"
          d="M2717.054,7663.015h6.611"
          transform="translate(9.793 -7326)"
          fill="none"
          stroke="#000"
          strokeWidth="3"
        />
      </g>
      <g id="Group_3070" data-name="Group 3070" transform="translate(2729 327)">
        <path
          id="Polygon_56-2"
          data-name="Polygon 56"
          d="M10,0,20,9H0Z"
          transform="translate(0 20) rotate(-90)"
        />
        <path
          id="Path_349-2"
          data-name="Path 349"
          d="M2723.665,7663.015h-6.611"
          transform="translate(-2708.513 -7653)"
          fill="none"
          stroke="#000"
          strokeWidth="3"
        />
      </g>
    </g>
  </CollapseIconWrapper>
);

export const VisibilityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18px"
    viewBox="0 0 24 24"
    width="18px"
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

export const VisibilityOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18px"
    viewBox="0 0 24 24"
    width="18px"
    fill="#000000"
  >
    <path
      d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z"
      fill="none"
    />
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

export const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

export const CreateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const TimelineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    height="22px"
    viewBox="0 0 24 24"
    width="22px"
    fill="#000000"
  >
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <g>
      <g>
        <g>
          <path d="M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z" />
        </g>
      </g>
    </g>
  </svg>
);

export const BlockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18px"
    viewBox="0 0 24 24"
    width="18px"
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
  </svg>
);

export const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.4168 15.9167H15.9168V27.4167H12.0835V15.9167H0.583496V12.0834H12.0835V0.583374H15.9168V12.0834H27.4168V15.9167Z"
      fill="black"
    />
  </svg>
);

export const ImportIcon = () => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 24 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.8332 0.833374H3.49984C1.9415 0.833374 0.680671 2.10837 0.680671 3.66671L0.666504 26.3334C0.666504 27.8917 1.92734 29.1667 3.48567 29.1667H20.4998C22.0582 29.1667 23.3332 27.8917 23.3332 26.3334V9.33337L14.8332 0.833374ZM17.6665 23.5H6.33317V20.6667H17.6665V23.5ZM17.6665 17.8334H6.33317V15H17.6665V17.8334ZM13.4165 10.75V2.95837L21.2082 10.75H13.4165Z"
      fill="black"
    />
  </svg>
);

export const ExportIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.833172 11.0417H18.5811L10.429 2.88962L12.4998 0.833374L24.1665 12.5L12.4998 24.1667L10.4436 22.1105L18.5811 13.9584H0.833172V11.0417Z"
      fill="black"
    />
  </svg>
);

export const DeactiveIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.4998 2.41669C7.82984 2.41669 2.4165 7.83002 2.4165 14.5C2.4165 21.17 7.82984 26.5834 14.4998 26.5834C21.1698 26.5834 26.5832 21.17 26.5832 14.5C26.5832 7.83002 21.1698 2.41669 14.4998 2.41669ZM4.83317 14.5C4.83317 9.15919 9.159 4.83335 14.4998 4.83335C16.7353 4.83335 18.7894 5.5946 20.4207 6.87544L6.87525 20.4209C5.59442 18.7896 4.83317 16.7354 4.83317 14.5ZM14.4998 24.1667C12.2644 24.1667 10.2103 23.4054 8.579 22.1246L22.1244 8.57919C23.4053 10.2104 24.1665 12.2646 24.1665 14.5C24.1665 19.8409 19.8407 24.1667 14.4998 24.1667Z"
      fill="black"
    />
  </svg>
);

export const ActiveActionIcon = () => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.25 20.25L6 15L4.25 16.75L11.25 23.75L26.25 8.75L24.5 7L11.25 20.25Z"
      fill="black"
    />
  </svg>
);

export const ActiveIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 25 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.24997 17.65L2.59997 11L0.383301 13.2166L9.24997 22.0833L28.25 3.0833L26.0333 0.866638L9.24997 17.65Z"
      fill="#17A617"
    />
  </svg>
);

export const InactiveIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.5 2.615L19.385 0.5L11 8.885L2.615 0.5L0.5 2.615L8.885 11L0.5 19.385L2.615 21.5L11 13.115L19.385 21.5L21.5 19.385L13.115 11L21.5 2.615Z"
      fill="#D11D1D"
    />
  </svg>
);

export const InvitedIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 25.5C20.3513 25.5 25.5 20.3513 25.5 14C25.5 7.64873 20.3513 2.5 14 2.5C7.64873 2.5 2.5 7.64873 2.5 14C2.5 20.3513 7.64873 25.5 14 25.5Z"
      stroke="#F4D8A5"
      strokeWidth="5"
    />
  </svg>
);

export const LockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29.9998 13.3332H28.3332V9.99984C28.3332 5.39984 24.5998 1.6665 19.9998 1.6665C15.3998 1.6665 11.6665 5.39984 11.6665 9.99984V13.3332H9.99984C8.1665 13.3332 6.6665 14.8332 6.6665 16.6665V33.3332C6.6665 35.1665 8.1665 36.6665 9.99984 36.6665H29.9998C31.8332 36.6665 33.3332 35.1665 33.3332 33.3332V16.6665C33.3332 14.8332 31.8332 13.3332 29.9998 13.3332ZM14.9998 9.99984C14.9998 7.23317 17.2332 4.99984 19.9998 4.99984C22.7665 4.99984 24.9998 7.23317 24.9998 9.99984V13.3332H14.9998V9.99984ZM29.9998 33.3332H9.99984V16.6665H29.9998V33.3332ZM19.9998 28.3332C21.8332 28.3332 23.3332 26.8332 23.3332 24.9998C23.3332 23.1665 21.8332 21.6665 19.9998 21.6665C18.1665 21.6665 16.6665 23.1665 16.6665 24.9998C16.6665 26.8332 18.1665 28.3332 19.9998 28.3332Z"
      fill="black"
    />
  </svg>
);

export const LockedIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.9998 28.3332C21.8332 28.3332 23.3332 26.8332 23.3332 24.9998C23.3332 23.1665 21.8332 21.6665 19.9998 21.6665C18.1665 21.6665 16.6665 23.1665 16.6665 24.9998C16.6665 26.8332 18.1665 28.3332 19.9998 28.3332ZM29.9998 13.3332H28.3332V9.99984C28.3332 5.39984 24.5998 1.6665 19.9998 1.6665C15.3998 1.6665 11.6665 5.39984 11.6665 9.99984H14.8332C14.8332 7.14984 17.1498 4.83317 19.9998 4.83317C22.8498 4.83317 25.1665 7.14984 25.1665 9.99984V13.3332H9.99984C8.1665 13.3332 6.6665 14.8332 6.6665 16.6665V33.3332C6.6665 35.1665 8.1665 36.6665 9.99984 36.6665H29.9998C31.8332 36.6665 33.3332 35.1665 33.3332 33.3332V16.6665C33.3332 14.8332 31.8332 13.3332 29.9998 13.3332ZM29.9998 33.3332H9.99984V16.6665H29.9998V33.3332Z"
      fill="black"
    />
  </svg>
);

export const CellEditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.625 20.8438V25.3751H8.15625L21.5204 12.0109L16.9892 7.47967L3.625 20.8438ZM25.0246 8.50676C25.4958 8.03551 25.4958 7.27426 25.0246 6.80301L22.1971 3.97551C21.7258 3.50426 20.9646 3.50426 20.4933 3.97551L18.2821 6.18676L22.8133 10.718L25.0246 8.50676Z"
      fill="black"
    />
  </svg>
);

export const SortAscIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.6668 5.33366L14.6668 21.5603L7.2135 14.107L5.3335 16.0003L16.0002 26.667L26.6668 16.0003L24.7868 14.1203L17.3335 21.5603L17.3335 5.33366L14.6668 5.33366Z"
      fill="black"
    />
  </svg>
);

export const SortDescIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="14px"
    viewBox="0 0 24 24"
    width="14px"
    fill="#000000"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
  </svg>
);

export const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="18px"
    viewBox="0 0 24 24"
    width="18px"
    fill="#000000"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export const ClosableUserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.25 21.25L15 17.575C14.5125 17.525 14.15 17.5 13.75 17.5C10.4125 17.5 3.75 19.175 3.75 22.5V25H15L11.25 21.25ZM13.75 15C16.5125 15 18.75 12.7625 18.75 10C18.75 7.2375 16.5125 5 13.75 5C10.9875 5 8.75 7.2375 8.75 10C8.75 12.7625 10.9875 15 13.75 15Z"
      fill="black"
    />
    <path
      d="M19.3375 25.625L15 21.25L16.75 19.4875L19.3375 22.0875L25.75 15.625L27.5 17.3875L19.3375 25.625Z"
      fill="black"
    />
  </svg>
);

export const ClosableInvestigationIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_721_455)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.75 24.0834L17 19.9184C16.4475 19.8617 16.0367 19.8334 15.5833 19.8334C11.8008 19.8334 4.25 21.7317 4.25 25.5001V28.3334H17L12.75 24.0834ZM15.5833 17.0001C18.7142 17.0001 21.25 14.4642 21.25 11.3334C21.25 8.20258 18.7142 5.66675 15.5833 5.66675C12.4525 5.66675 9.91667 8.20258 9.91667 11.3334C9.91667 14.4642 12.4525 17.0001 15.5833 17.0001Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.9158 29.0418L17 24.0835L18.9833 22.086L21.9158 25.0327L29.1833 17.7085L31.1667 19.706L21.9158 29.0418Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_721_455">
        <rect width="34" height="34" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const SeverityIcon = ({ color = '' }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill={color} />
  </svg>
);

export const AsteriskColorSpan = styled.span`
  color: #fb7e23;
`;

export const HelpIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1269_5256)">
      <path
        d="M13.2917 21.75H15.7084V19.3333H13.2917V21.75ZM14.5 2.41666C7.83002 2.41666 2.41669 7.82999 2.41669 14.5C2.41669 21.17 7.83002 26.5833 14.5 26.5833C21.17 26.5833 26.5834 21.17 26.5834 14.5C26.5834 7.82999 21.17 2.41666 14.5 2.41666ZM14.5 24.1667C9.17127 24.1667 4.83335 19.8287 4.83335 14.5C4.83335 9.17124 9.17127 4.83332 14.5 4.83332C19.8288 4.83332 24.1667 9.17124 24.1667 14.5C24.1667 19.8287 19.8288 24.1667 14.5 24.1667ZM14.5 7.24999C11.8296 7.24999 9.66669 9.41291 9.66669 12.0833H12.0834C12.0834 10.7542 13.1709 9.66666 14.5 9.66666C15.8292 9.66666 16.9167 10.7542 16.9167 12.0833C16.9167 14.5 13.2917 14.1979 13.2917 18.125H15.7084C15.7084 15.4062 19.3334 15.1042 19.3334 12.0833C19.3334 9.41291 17.1704 7.24999 14.5 7.24999Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1269_5256">
        <rect width="29" height="29" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const RemoveIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 35 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1269_5331)">
      <path
        d="M8.74996 27.7083C8.74996 29.3125 10.0625 30.625 11.6666 30.625H23.3333C24.9375 30.625 26.25 29.3125 26.25 27.7083V10.2083H8.74996V27.7083ZM27.7083 5.83333H22.6041L21.1458 4.375H13.8541L12.3958 5.83333H7.29163V8.75H27.7083V5.83333Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_1269_5331">
        <rect width="35" height="35" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
