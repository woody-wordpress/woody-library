<?php

namespace WoodyLibrary\Library\WoodyLibrary;

/**
 * Plugin Name: Woody Library
 * Plugin URI: https://github.com/woody-wordpress/woody-library
 * Description: Catalogue of block and section templates for the Woody builder.
 * Author: Raccourci Agency
 * Author URI: https://www.raccourci.fr
 * License: GPL2
 *
 * This program is GLP but; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of.
 */

use Symfony\Component\Finder\Finder;
use JsonException;

/**
 *
 */
class WoodyLibrary
{
    public static function getTemplatesDirname()
    {
        $dirs = [__DIR__ . '/views'];
        if (function_exists('apply_filters')) {
            $dirs = apply_filters('woody_library_templates_directories', $dirs); // Filter to add directory
        }

        return $dirs;
    }

    public static function getTemplatesByAcfGroup($components, $id)
    {
        $return = [];
        foreach ($components as $component => $val) {
            if (!empty($val['acf_groups']) && in_array($id, $val['acf_groups'])) {
                unset($val['acf_groups']);
                $return[$component] = $val;
            }
        }

        return $return;
    }

    public static function getTwigsPaths($components)
    {
        $return = [];
        foreach ($components as $key => $val) {
            $return[$key] = $val['twig'];
        }

        return $return;
    }

    public static function getComponents()
    {
        // Get all folders named tpl_* in $name folder
        $path = self::getTemplatesDirName();
        $finder = new Finder();
        $finder->name('tpl_*')->directories()->in($path);
        $components = self::getComponentsData($finder);

        if (function_exists('apply_filters')) {
            $components = apply_filters('get_woody_components', $components); // Filter to remove blocks
        }

        return $components;
    }

    public static function getComponentsData($finder)
    {
        $components = [];
        foreach ($finder as $folder) {
            // Foreach folder, get full and relative path
            $folder_path = $folder->getRealPath();
            $folder_name  = $folder->getRelativePathname();
            $name = str_replace('/', '-', $folder_name);

            // Get all json files (.json) in the targeted folder
            // to add templates[thumbnails]

            $jsonsFinder = new Finder();
            $jsonsFinder->files()->name('*.json')->in($folder_path);
            foreach ($jsonsFinder as $json) {
                try {
                    $json_data = file_get_contents($json);
                    $php_data = json_decode($json_data, true, 512, JSON_THROW_ON_ERROR);
                } catch (JsonException $jsonException) {
                    wd(sprintf('%s : %s', $jsonException->getMessage(), $json), 'emergency');
                }

                if (empty($php_data['approved']) || $php_data['approved'] == false) {
                    continue;
                }

                if (!empty($php_data['acf_groups'])) {
                    foreach ($php_data['acf_groups'] as $acf_group) {
                        $components[$name]['acf_groups'][] = $acf_group;
                    }
                } else {
                    $components[$name]['acf_groups'][] = '';
                }

                $components[$name]['name'] = (empty($php_data['name'])) ? '' : $php_data['name'];
                $components[$name]['description'] = (empty($php_data['description'])) ? '' : $php_data['description'];
                $components[$name]['display'] = (empty($php_data['display'])) ? '' : $php_data['display'];
                $components[$name]['creation'] = (empty($php_data['creation'])) ? '' : $php_data['creation'];
            }

            // Get all images files (.png) in the targeted folder
            // to add templates[$short_name][thumbnails]
            $thumbsFinder = new Finder();
            $thumbsFinder->files()->name('*.png')->in($folder_path);
            foreach ($thumbsFinder as $thumb) {
                $thumb_realPath = $thumb->getRealPath();
                $thumb_realPath = explode('/', $thumb_realPath);
                $keep = false;
                $url = [];
                foreach ($thumb_realPath as $path_part) {
                    if ($keep == true) {
                        $url[] = $path_part;
                    }

                    if ($path_part == 'views' || $path_part == 'Views') {
                        $keep = true;
                    }
                }

                $components[$name]['thumbnails']['small'] = implode('/', $url);
            }

            // Get all twig files in the targeted folder
            // to add templates[$short_name]['twig']
            $twigFinder = new Finder();
            $twigFinder->files()->name('*.twig')->in($folder_path);
            foreach ($twigFinder as $twig) {
                $twigRealPath = $twig->getRealPath();
                $twigRealPath = str_replace(self::getTemplatesDirName(), '', $twigRealPath);
                $components[$name]['twig'] = $twigRealPath;
            }
        }

        return $components;
    }
}
