# Siam - a platform agnostic way to define component libraries

Siam allows you to define design tokens and elements (e.g. buttons, checkboxes etc) in a way that is platform agnostic. The tokens and elements are defined in a System file which can be converted into something usable: CSS, React components etc. You can create your system from scratch, use a pre-defined system or compose one from Siam's library of tokens and elements.

## What kind of problems does it solve?

- Serves as a master source for design tokens and elements. Target multiple SDKs from the same single source. 
- The libraries we use change often: Angular 1, React JS, Angular 2, Vue etc; but the component styles we use are stable: solid buttons, round buttons, outline button etc. Each time a new library emerges, Siam just needs an adapter to convert existing Systems into usable code for that library.
- Tired of every app or site looking like Popular Component library with the only the color scheme changed? Siam makes it easy to quickly create something unique. You can also combine existing library tokens and elements into your own unique System.
- Siam is designer and developer friendly. Everyone can use the same master source.

## Prerequisites

- Know what [Design Tokens](https://spectrum.adobe.com/page/design-tokens/) are
- Knowledge of an object data format like [JSON or XML](https://beginnersbook.com/2015/04/json-tutorial/)

## What does it look like?

At the heart of Siam is a System file. Let's start with a basic System written in JSON. 

```JSON
{
    "tokens": {
        "colors": {
            "primary": "blue",
            "primary.text": "black",
        }
     }
}
```

The above doesn't define much but it is still a valid System. You can take this file and export it to one or more Targets. Let's see some example outputs:

```JavaScript
// A JavaScript object that could used as a theme with libraries like Emotion or Styled Components
const Theme = {
    colors: {
       primary:"blue",
       "primary.text": "black"
    }
}
``` 

```XML
/** An android Colors resource file **/
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">blue</color>
    <color name="primary_text">black</color>
</resources>
``` 

Developers that know JavaScript can easily register their own adapter plugin which can target any platform or SDK they want, including custom systems. Here we are just outputting code but Siam could just as easily output Figma or Sketch files for designers to use as their starting point. 

## How can you define Systems?

You can write JSON, JavaScript or TypeScript. You can also use Siam's internal tab-indented system format, SSF, which is optimised for typing. The System above would look as follows using the SSF format:

```
tokens
    colors
        primary blue
        light.text white 
```

Siam also provides an editor with validation and code completion which makes creating new Systems very efficient. 

## A closer look at the System schema

As well as tokens we can create elements and aliases in our System. A slightly more complex system would look as follows:

```YAML
aliases
    tokens
        colors backgroundColor, color 
tokens
    colors
        primary blue
        lightText white 
elements
    button
        color lightText
        backgroundColor primary

```

#### A breakdown of the System above

Aliases map element property names onto token objects. The above System uses common names from CSS: `background-color` and `color` but in camel-case. The adapter code that will convert this system to something usable needs this mapping to be able to look-up color tokens. You can see that button `backgroundColor` property is "primary" which is a color token above. We need an alias here because colors can be mapped onto many properties: `color`, `backgroundColor`, `leftBorderColor` etc. In general though the token name should be named exactly as the property it maps to e.g. `borderRadius`. This convention means that you will not need so many token aliases in your System. Let's add `borderRadius` now: 

```YAML
aliases
    tokens
        colors backgroundColor, color 
tokens
    colors
        primary blue
        light.text white
    borderRadius # New tokens
        sm 3
        md 6 
elements
    button
        color lightText
        backgroundColor primary
        borderRadius sm # New property which automatically maps to the new tokens above
```

As well as `aliases` we added `elements`. Elements are made up of properties which typically get their values from tokens - you can also use constant property values but it's not recommended. Elements also support modifiers and states but these are not used above. We have created only a single button element. Here's an example of how it might look if you choose the HTML & CSS Target:

```CSS
:root {
    --color-primary: blue;
    --color-light-text: white;
    --border-radius-sm: 3px;
    --border-radius-md: 6px;
}

button {
    background-color: var(--color-primary);
    color: var(--color-light-text);
    border-radius: var(--border-radius-sm);
}
```

This is obviously not a very good button but we can at least what's possible with Siam.

## Adding modifiers and states

Many elements have different states: disabled, focus, hover etc. Some elements also support modifiers: size, type, role etc. Buttons need styles for states and for various modifiers, so let's add these now.

```YAML
aliases
    tokens
        colors backgroundColor, color
        sizes width, height 
tokens
    colors
        primary blue
        danger red
        lightText white
    borderRadius 
        sm 3
        md 6 
    sizes # new tokens. Like colors, sizes can map onto many properties so we need an alias above
        controlRegularHeight 40
        controlLargeHeight 50
elements
    button
        borderRadius sm 
        color lightText
        roles # new modifier for roles
          primary 
            backgroundColor primary  
          danger
            backgroundColor danger    
        size # new modifier for roles
          regular controlRegularHeight
          large controlLargeHeight
```

This is still a very basic System but it can now produce multiple buttons styles thanks to using modifiers. Let look at the output:

```CSS
:root {
    --color-primary: blue;
    --color-danger: red;
    --color-light-text: white;
    --border-radius-sm: 3px;
    --border-radius-md: 6px;
    --size-control-height-regular: 40px;
    --size-control-height-large: 50px;
}

button {    
    color: var(--color-light-text);
    border-radius: var(--border-radius-sm);
}

button.primary {
    background-color: var(--color-primary);
}

button.danger {
    background-color: var(--color-danger);
}

button.regular {
    height: var(--size-control-height-regular);
}

button.large {
    height: var(--size-control-height-large);
}
```

We could then make use of the above like so:

```HTML
<!-- A large primary button element -->
<button class="primary large">Click me</button>

<!-- A regular danger button element -->
<button class="danger regular">Click me</button>

```

The above is just for illustration purposes. A good Target adapter will default buttons to be primary color and regular size whereas we specify these explicitly here.

# Adding element state styles

We will now modify our System so the buttons support states. We will just add the hover state. Notice that we use a colon before the state name? This is the same as in CSS.


```YAML
aliases
    tokens
        colors backgroundColor, color
        sizes width, height 
tokens
    colors
        primary blue
        primaryDark darkblue
        danger red
        dangerDark darkred
        lightText white
    borderRadius 
        sm 3
        md 6 
    sizes # new tokens. Like colors, sizes can map onto many properties so we need an alias above
        controlRegularHeight 40
        controlLargeHeight 50
elements
    button
        borderRadius sm 
        color lightText        
        roles # new modifier for roles
          primary 
            backgroundColor primary
            :hover 
              backgroundColor primaryDark
          danger
            backgroundColor danger
            :hover 
              backgroundColor dangerDark
        size # new modifier for roles
          regular controlRegularHeight
          large controlLargeHeight
```

And here's the output:

```CSS
:root {
    --color-primary: blue;
    --color-primary-dark: darkblue;
    --color-danger: red;
    --color-danger-dark: darkred;
    --color-light-text: white;
    --border-radius-sm: 3px;
    --border-radius-md: 6px;
    --size-control-height-regular: 40px;
    --size-control-height-large: 50px;
}

button {    
    color: var(--color-light-text);
    border-radius: var(--border-radius-sm);
}

button.primary {
    background-color: var(--color-primary);
}
button.primary:hover {
    background-color: var(--color-primary-dark);
}

button.danger {
    background-color: var(--color-danger);
}

button.danger:hover {
    background-color: var(--color-danger-dark);
}

button.regular {
    height: var(--size-control-height-regular);
}

button.large {
    height: var(--size-control-height-large);
}
```

So to wrap up, we've covered tokens, token aliases and elements that used modifiers and states. Siam can do more than this but even with just the above you can define complex design systems. 