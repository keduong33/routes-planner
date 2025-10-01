//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [...tanstackConfig, eslintConfigPrettier, {
    rules: {
        'import/order': 'off'
    }
}]
