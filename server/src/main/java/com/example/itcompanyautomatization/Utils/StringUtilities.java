package com.example.itcompanyautomatization.Utils;

public class StringUtilities {
    
    public static Boolean IsNullOrEmpty(String str){
        return str == null || str.isBlank() || str.isEmpty();
    }
}
