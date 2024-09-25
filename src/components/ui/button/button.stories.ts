import { Meta, StoryObj } from '@storybook/react'
import { ButtonProps, Button } from './button'

const meta: Meta<ButtonProps> = {
  title: 'Molecules/Button',
  // tags: ["autodocs"],
  component: Button,
  argTypes: {
    children: {
      type: 'string',
      description: "The button's content"
    },
    disabled: {
      type: 'boolean',
      description: 'If the button is disabled'
    },
    className: {
      type: 'string',
      description: "The button's class"
    }
  }
}

export default meta

export const Primary: StoryObj<ButtonProps> = {
  args: {
    children: 'Button'
  }
}

export const Disabled: StoryObj<ButtonProps> = {
  args: {
    children: 'Button',
    disabled: true
  }
}

export const Secundary: StoryObj<ButtonProps> = {
  args: {
    children: 'Button',
    variant: 'secondary'
  }
}

export const SecundaryDisabled: StoryObj<ButtonProps> = {
  args: {
    children: 'Button',
    variant: 'secondary',
    disabled: true
  }
}
