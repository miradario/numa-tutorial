import { Blur, Canvas, GradientProps, RadialGradient, Rect, vec } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";

const { width, height } = Dimensions.get('screen');

const VISUAL_CONFIG = {
    blur: 10,
    center: { x: width / 2, y: height / 2 },
    
} as const;

const ANIMATION_CONFIG = {
    duration: {
        MOUNT: 2000,
        SPEAKING_TRANSITION: 600,
        QUIET_TRANSITION: 400,
        PULSE: 1000,
    },
    spring: {
        damping: 20,
        stiffness: 90,
    }
} as const;

const RADIUS_CONFIG = {
    minScale: 0.6,
    maxScale: 1.4,
    speakingScale: 1.00,
    quietScale: 0.6,
    baseRadius: {
        default: width,
        speaking: width / 4,      
    }
} as const;

type GradientPosition = "top" | "bottom" | "center";

type GradientProps = {
    position?: GradientPosition;
    isSpeaking : boolean;
}

const getTagetY = (position: GradientPosition): number => {
    switch (position) {
        case "top":
            return 0;
        case "bottom":
            return height;
        case "center":
            return VISUAL_CONFIG.center.y ;
        default:
            return VISUAL_CONFIG.center.y ;
    }
}

const calculateRaidusBounds = (baseRadius: number) => {
    "worklet";
    const min = baseRadius * RADIUS_CONFIG.minScale;
    const max = baseRadius * RADIUS_CONFIG.maxScale;
    return { min, max };
}

const calculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
    "worklet";
    const { min, max } = calculateRaidusBounds(baseRadius);
    const scale = isSpeaking ? RADIUS_CONFIG.speakingScale : RADIUS_CONFIG.quietScale;
    return min + (max - min) * scale;
}

export function Gradient( {position, isSpeaking} : GradientProps) {
    const animatedY = useSharedValue(0);
    const radiusScale = useSharedValue(1);
    const baseRadiusValue = useSharedValue(RADIUS_CONFIG.baseRadius.default)
    const mountRadius = useSharedValue(0);

    const center = useDerivedValue(() => {
        return vec(VISUAL_CONFIG.center.x, animatedY.value);
    }
        , [animatedY]);
    
    const animatedRadius = useDerivedValue(() => {
        const { min, max } = calculateRaidusBounds(baseRadiusValue.value);
        const calculateRaidus = min + (max - min) * radiusScale.value;
        return mountRadius.value < calculateRaidus ? mountRadius.value : calculateRaidus;

    }
        , [radiusScale, baseRadiusValue]);

    
    useEffect(() => {
       animatedY.value = getTagetY(position || "center");
    }
        , []);
    
    useEffect(() => {
        const targetRadius = calculateTargetRadius (RADIUS_CONFIG.baseRadius.default, isSpeaking);
        mountRadius.value = withTiming(targetRadius, {
            duration: ANIMATION_CONFIG.duration.MOUNT
        });
    }
        , []);
    
    
    useEffect(() => {
        const targetY = getTagetY(position || "center");
        animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);
    }
        , [position, animatedY]);
    
    useEffect(() => {
        const duration = ANIMATION_CONFIG.duration.SPEAKING_TRANSITION;
        if (isSpeaking) {
            baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking, { duration });
            animatedY.value = withTiming (getTagetY("center"), { duration });
        }
        else {
            baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.default, { duration });
            animatedY.value = withTiming (getTagetY(position || "center"), { duration } );
        }
    }, [isSpeaking, baseRadiusValue, animatedY, position]);

    useEffect(() => {
        if (isSpeaking) {
            radiusScale.value = withRepeat(
                withTiming(RADIUS_CONFIG.speakingScale, { duration: ANIMATION_CONFIG.duration.PULSE }),
                -1,
                true
            );
         
        }else {
            radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, { duration: ANIMATION_CONFIG.duration.QUIET_TRANSITION });
        }
    }, [isSpeaking]);
    
    return (
        <View style={StyleSheet.absoluteFill}>
            <Canvas style={{flex:1 } }>
                <Rect x={0} y={0} width={width} height={height}>
                    <RadialGradient 
                        c={center} 
                        r={animatedRadius} 
                        colors={[Colors.mediumBlue, Colors.lightBlue, Colors.teal, Colors.iceBlue, Colors.white,]} 
                        
                    />

                </Rect>
                <Blur blur={VISUAL_CONFIG.blur} mode="clamp" />
            </Canvas>
        </View>
    )
}

const Colors = {
    white: '#FFFFFF',
    teal: '#5AC8FA',
    mediumBlue: '#007AFF',
    lightBlue: '#34C1FF',
    iceBlue: '#E6F7FF',
} 
