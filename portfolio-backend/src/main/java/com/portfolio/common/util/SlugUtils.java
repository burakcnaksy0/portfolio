package com.portfolio.common.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtils {

    private SlugUtils() {}

    private static final Pattern NON_LATIN   = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE  = Pattern.compile("[\\s]+");
    private static final Pattern MULTI_DASH  = Pattern.compile("-{2,}");
    private static final Pattern EDGE_DASH   = Pattern.compile("(^-|-$)");

    /**
     * Converts a title to a URL-safe slug.
     * Handles Turkish characters: ı→i, ö→o, ü→u, ş→s, ç→c, ğ→g
     */
    public static String toSlug(String title) {
        if (title == null || title.isBlank()) return "";

        String result = title.toLowerCase();

        // Turkish character normalization
        result = result
                .replace('ı', 'i')
                .replace('İ', 'i')
                .replace('ö', 'o')
                .replace('Ö', 'o')
                .replace('ü', 'u')
                .replace('Ü', 'u')
                .replace('ş', 's')
                .replace('Ş', 's')
                .replace('ç', 'c')
                .replace('Ç', 'c')
                .replace('ğ', 'g')
                .replace('Ğ', 'g');

        result = Normalizer.normalize(result, Normalizer.Form.NFD);
        result = NON_LATIN.matcher(result).replaceAll("");
        result = WHITESPACE.matcher(result).replaceAll("-");
        result = MULTI_DASH.matcher(result).replaceAll("-");
        result = EDGE_DASH.matcher(result).replaceAll("");

        return result;
    }

    /**
     * Creates a unique slug by appending a counter suffix if needed.
     * The caller must check uniqueness via repository.
     */
    public static String toUniqueSlug(String title, int attempt) {
        String base = toSlug(title);
        return attempt <= 1 ? base : base + "-" + attempt;
    }
}
