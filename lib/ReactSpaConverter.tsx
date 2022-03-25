import {
    HTMLAttributes,
    ReactNode,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import { v4 as UUID } from "uuid";

// region [types]
/**
 * @description SpaConverter 的入参
 */
export interface SpaConverterProp extends HTMLAttributes<HTMLElement> {
    // 子应用加载路径
    entryPath: string
    // 传递给子应用的参数
    deepProps?: Record<string, any>
    // 加载状态的展示内容
    loadingDisplay?: ReactNode | void
    // 错误状态的展示内容
    errorDisplay?: (msg: string) => ReactNode
}

/**
 * @description import('entry-path-to-sub-spa').then(spa: SpaModule)
 */
export interface SpaModule {
    default: (container: HTMLDivElement | null) => SpaModuleMethod
}

/**
 * @description 子应用的生命周期方法
 * @example
 * 调用 subSpaInstance.mount() 以挂载子应用
 * 调用 subSpaInstance.render() 以绘制子应用
 * 调用 subSpaInstance.unmount() 以卸载子应用
 */
export interface SpaModuleMethod {
    mount?: (props?: Record<string, any>) => void
    render?: (props?: Record<string, any>) => ReactNode  // 实际上是void返回值
    unmount?: () => void
}

/**
 * @description defineSpaApp 的入参
 */
export type SpaConstructor = (container: HTMLElement) => SpaModuleMethod
// endregion

// region 内部方法
/**
 * @description Makes it possible to get the entry path of the sub-application asynchronously
 */
const loadSpaModule = (entryPath: string | (() => Promise<string>)): Promise<SpaModule> => {
    if(typeof entryPath === 'string') {
        return import(/* @vite-ignore */`${ entryPath }`)
    }
    else if(typeof entryPath === 'function') {
        return entryPath().then((realPath) => {
            return import(/* @vite-ignore */`${ realPath }`)
        })
    }
    else {
        return Promise.reject('Type Error: entry path of spa.')
    }
}

/**
 * @description 加载子应用后进行检查 (正确 - 返回子模块生命周期方法; 错误 - 抛出错误信息)
 */
const spaModuleCheck = (spaModule: SpaModule, container: HTMLDivElement): Promise<SpaModuleMethod> => {
    if(typeof spaModule.default !== 'function') return Promise.reject(`[SubSpa] 导出格式错误, 缺失必要的 'default' 导出.`)
    else if(!container) return Promise.reject(`[SubSpa] 挂载元素错误, 目标元素不存在.`)
    else {
        const _spa = spaModule.default(container) as SpaModuleMethod

        if(!_spa.mount && !_spa.render) return Promise.reject(`[SubSpa] 'mount' 和 'render' 方法同时缺失, 需要至少一项不为空.`)
        else if(_spa.mount && !_spa.unmount) return Promise.reject(`[SubSpa] 'unmount' 方法缺失, 当 'mount' 方法非空时, 'unmount' 方法为必须项.`)
        else return Promise.resolve(_spa)
    }
}

// endregion

/**
 * @description 主应用使用 React 时, 子应用使用的包装器
 * @example
 * <Routes>
 *     <Route element={ <ReactSpaConverter entryPath="entry-path-of-sub-app" /> }>
 * </Routes>
 */
export function ReactSpaConverter(converterProp: SpaConverterProp): JSX.Element {
    // 解构
    const { entryPath, deepProps, loadingDisplay, errorDisplay, ...props } = converterProp
    // 子应用容器
    // const containerRef = useRef<HTMLDivElement>(null)
    // const containerDom = (slot?: ReactNode) => <div id={UUID()}>{slot}</div>
    // const [containerId] = useState<string>(UUID())
    const containerId = UUID()
    // 子应用配置
    const spaMethodRef = useRef<SpaModuleMethod>()
    // converter加载状态
    const [ converterLoading, setConverterLoading ] = useState<boolean>(true)
    // 错误信息
    const [ errMsg, setErrMsg ] = useState<string>('')

    // 仅执行一次 once
    useLayoutEffect(() => {
        console.log(entryPath)
        const containerEl = document.getElementById(containerId) as HTMLDivElement

        if(!containerEl) {
            alert('[Sub Spa] No container matched!')
        }
        else {
            // 加载子应用
            loadSpaModule(entryPath)
                .then((spaModule) => spaModuleCheck(spaModule, containerEl))
                .then((spaMethod) => {
                    // 子应用有 'mount' 方法 - 渲染子应用
                    if(!!spaMethod.mount) {
                        setConverterLoading(false)  // converter准备就绪
                        spaMethodRef.current = spaMethod
                        spaMethod.mount(deepProps)  // 渲染子应用
                    }
                    // 子应用无 'mount' 方法 - 仅更新子应用ref
                    else {
                        setConverterLoading(false)
                        spaMethodRef.current = spaMethod
                    }
                })
                .catch((err) => {
                    setErrMsg(err.toString)  // 更新错误信息
                    setConverterLoading(false)  // 取消加载状态
                })
        }
        // Effect 清除 - 即加载新的子应用前卸载上一个应用
        return () => {
            const spaMethod = spaMethodRef.current
            if(!!spaMethod && spaMethod.unmount) spaMethod.unmount()
        }
    }, [])

    // 暂存当前的子应用方法
    const spa = spaMethodRef.current

    // 返回子应用的容器
    return (
        <div { ...props } id={ containerId }
             style={ {
                 position: 'relative',
                 width: '100%',
                 height: '100%'
             } }>
            {
                errMsg !== ''
                    ? errorDisplay
                        ? errorDisplay(errMsg)
                        : errMsg
                    : converterLoading
                        ? loadingDisplay
                            ? loadingDisplay
                            : "[Sub Spa] Converter is preparing."
                        : (spa && spa.render)
                            ? spa.render(deepProps)
                            : '[Sub Spa] This Sub-app has no content.'
            }
        </div>
    )
}

/**
 * @description 子应用实例处理
 * @example
 * // 1. 子应用应具有默认导出:
 * export default () => ({
 *     mount() { ... },
 *     render() { ... },
 *     unmount() { ... }
 * })
 * // 2. 或在子应用入口文件中使用
 * export default defineSpaApp((container: HTMLElement, injects?: (instance: SpaModuleMethod) => void) => {
 *     // 其他处理
 *     return {
 *         mount() { ... },
 *         render() { ... },
 *         unmount() { ... }
 *     }
 * )
 */
export function defineSpaApp(spaConstructor: SpaConstructor, injects?: (instance: SpaModuleMethod) => void) {
    return ((container: HTMLElement) => {
        const spaInstance = spaConstructor(container)

        Object.freeze(spaInstance)
        injects?.(spaInstance)

        return spaInstance
    })
}
