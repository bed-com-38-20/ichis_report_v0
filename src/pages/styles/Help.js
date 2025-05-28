import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'
import { blue } from '@material-ui/core/colors'

export default css`
    .main {
        max-width: 80ch;
    }

    .divider {
        height: 1px;
        margin-top: 2rem;
        margin-bottom: 2rem;
        background-color: ${blue};
    }

    ol {
        margin-bottom: 1rem;
    }

    li {
        margin-bottom: 0.5rem;
    }

    ul {
        margin-top: 0.25rem;
    }
`
