import Case from 'case'
import React, { ReactNode } from 'react'

import Typography, { TypographyProps } from '@mui/material/Typography'

interface TitleProps extends TypographyProps {
	children: ReactNode | string
}

export const Title = ({ children }: TitleProps) => (
	<Typography
		data-cy={`title__${  Case.snake(String(children))}`}
		data-testid={`title__${  Case.snake(String(children))}`}
		component="h1"
		variant="h3"
	>
		{children}
	</Typography>
)

export const Header = ({ children }: TitleProps) => (
	<Typography component="h1" variant="h4">
		{children}
	</Typography>
)

export const SubHeader = ({ children }: TitleProps) => (
	<Typography component="h1" variant="h5">
		{children}
	</Typography>
)

export const Paragraph = ({ children, ...props }: TitleProps) => (
	<Typography component="p" variant="body1" {...props}>
		{children}
	</Typography>
)
